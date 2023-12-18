import { Component } from '@angular/core';
import { Equipment, EquipmentCompany } from '../model/equipmentModel';
import { EquipmentService } from '../equipment.service';
import { FormControl, FormGroup, NgModel } from '@angular/forms';

@Component({
  selector: 'xp-all-equipment-preview',
  templateUrl: './all-equipment-preview.component.html',
  styleUrls: ['./all-equipment-preview.component.css']
})
export class AllEquipmentPreviewComponent {
  equipments: Equipment[] = [];
  renderCreateCompany: boolean = false;
  searchValue: String;
  filteredEquipments: Equipment[] = [];
  selectedGrade: string = ''; 
  selectedTypeOfEquipment: string ='';

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit(): void {
    this.refreshEquipmentList(); // Initial load of companies

    // Subscribe to the addCompanyClicked event
    this.equipmentService.getAllEquipments().subscribe(() => {
      this.refreshEquipmentList(); // Refresh the list of companies
    });

  }
  refreshEquipmentList(): void {
    this.equipmentService.getAllEquipments().subscribe({
      next: (result: Equipment[]) => {
        this.equipments = result;
        this.filteredEquipments = this.equipments;
      },
    });
  }

  onSearchChange(): void {
    this.filterEquipments();
  }
  

  private filterEquipments(): void {
    this.filteredEquipments = this.equipments.filter((c) =>
      c.name.toLowerCase().match(this.searchValue.toLowerCase()) 
    );
  }
  onGradeChange(): void{
    this.equipmentService.getByGradeEquipment(this.selectedGrade).subscribe({
      next: (result: Equipment[]) => {
        this.filteredEquipments = result;
      }
    })
  }

  onTypeChange(): void{
    this.equipmentService.getByTypeEquipment(this.selectedTypeOfEquipment).subscribe({
      next: (result: Equipment[]) => {
        this.filteredEquipments = result;
      }
    })
  }
}
