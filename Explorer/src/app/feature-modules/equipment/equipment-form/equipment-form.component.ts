import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Equipment } from '../model/equipmentModel';
import { EquipmentService } from '../equipment.service';
import { CompanyService } from '../../company/company.service';
import { Company, CompanyEquipment, TypeOfEquipment } from '../../company/model/companyModel';


@Component({
  selector: 'xp-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css']
})
export class EquipmentFormComponent {
  @Input() equipment: CompanyEquipment;
  @Input() company: Company;
  @Output() updateEquipmentClicked = new EventEmitter<void>();

  renderUpdateEquipment: boolean = true;
  typesOfEquipment: string[] = Object.values(TypeOfEquipment);
  
  
  constructor(private _companyService: CompanyService, private _equipmentService: EquipmentService){
  }

  equipmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    typeOfEquipment: new FormControl('', [Validators.required]),
    grade: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    quantity: new FormControl(0, [Validators.required])
  });

  ngOnChanges(changes: SimpleChanges):void {
    this.equipmentForm.reset();
    this.equipmentForm.patchValue(this.equipment);
  }

  updateEquipment(): void {
    console.log('USAO U APDEJT EQUI')
    const updatedEqupiment = {
      id: 0,
      name: this.equipmentForm.value.name || '',
      description: this.equipmentForm.value.description || '',
      typeOfEquipment: this.equipmentForm.value.typeOfEquipment as TypeOfEquipment || '',
      grade: this.equipmentForm.value.grade || '',
      price: this.equipmentForm.value.price || 0
    };

    const quantity = this.equipmentForm.value.quantity !== null && this.equipmentForm.value.quantity !== undefined
      ? (this.equipmentForm.value.quantity >= 0 ? this.equipmentForm.value.quantity : 0) : 0;

    console.log(updatedEqupiment);
    console.log(this.equipment.id);
  
    this._equipmentService.addEquipment(updatedEqupiment).subscribe({
      next: (updatedEquipmentFromBackend: Equipment) => {
        console.log('APDEJTOVAN EQUIPMENT SA BEKA');
        console.log(updatedEquipmentFromBackend);
        const index = this.company.equipmentSet.findIndex(e => e.id === this.equipment.id);
        if (index !== -1) {
          this.company.equipmentSet[index] = updatedEquipmentFromBackend;
        }
        console.log('ZAMENJENA KOMPANIJA');
        console.log(this.company);

        this._companyService.updateCompanyEquipment(this.company, this.equipment.id!, updatedEquipmentFromBackend.id, quantity).subscribe({
          next: () => {
            this.updateEquipmentClicked.emit();
            this.equipmentForm.reset();
            this.renderUpdateEquipment = false;
          },
          error: (error: any) => {
            console.error('Error updating company equipment', error);
          },
        });

        this.equipmentForm.reset();
  
        this.renderUpdateEquipment = false;
      },
      error: (error: any) => {
        console.error('Error updating company equipment', error);
      },
    });
  }
}
