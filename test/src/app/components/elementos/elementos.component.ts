import { Router, ActivatedRoute } from '@angular/router';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-elementos',
  templateUrl: './elementos.component.html',
  styleUrls: ['./elementos.component.scss']
})
export class ElementosComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  panelOpenState = false;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
        nombre: ['', Validators.required],
        peso: ['', Validators.required],
        simbolo: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
}
  get f() { return this.registerForm.controls; }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource.data);
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
        return;
    }
    const el = this.dataSource.data.find(x => x.name === this.f.nombre.value && x.symbol === this.f.simbolo.value);
    if (!el) {
      this.dataSource.data.push(
        {
          position: this.dataSource.data.length + 1,
          name: this.f.nombre.value,
          weight: this.f.peso.value,
          symbol: this.f.simbolo.value
        }
      );
      this.dataSource.data = this.dataSource.data;
      this.changeDetectorRefs.detectChanges();
    } else {
      Swal.fire({
        title: '¡Error!',
        text: 'Ya existe un elemento con estas características',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    };
    this.submitted= false;
    this.registerForm.reset();
    this.loading = true;

  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

let ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hidrógeno', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Hélio', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Litio', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Berilio', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boro', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbón', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogeno', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxígeno', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Flúor', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neón', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodio', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesio', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminio', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicio', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Fósforo', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Azufre', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Cloro', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argón', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potasio', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcio', weight: 40.078, symbol: 'Ca'},
];

