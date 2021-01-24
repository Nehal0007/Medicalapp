import { Component, OnInit } from '@angular/core';
import {FireserviceService} from '../fireservice.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  Name:string;
  Price:number;
  id:string;
  data:any;
  retrievedata:any;
  dataSource:any;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  

  constructor(private fireser:FireserviceService,public af:AngularFirestore,public sp:NgxSpinnerService) { 
    
    this.fireser.getproducts().subscribe(products=>{
      this.sp.show();
      this.retrievedata=products;
      console.log(this.retrievedata);
      this.dataSource = new MatTableDataSource(this.retrievedata);
      
        /** spinner ends after 5 seconds */
        
          this.sp.hide();
        
  
      this.dataSource.paginator = this.paginator;
      
    }


     )
  }
  ngAfterViewInit() {
    
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  displayedColumns: string[] = ['id','names','price','actions'];
 clear()
 {
  this.Name="";
  this.Price=0;
 }
  edit(element)
  {

    this.Name=element.names;
    this.Price=element.price;
    this.id=element.id;
    
  }

  ngOnInit(): void { 
    this.sp.show();

  }
  
  updateproduct()
  {
   
    this.data={
      'id':this.id,
      'names':this.Name,
      'price':this.Price        
    };

    this.fireser.update_product(this.data,this.id);

  }

  deleteproduct(row)
  {
    if(confirm("Are you sure to Delete?"+row.names))
    {
    this.fireser.delete_product(row.id);
    }
    else{}
  }
  
  Submit()
  {
    this.id=this.af.createId();

    this.data={
        'id':this.id,
        'names':this.Name,
        'price':this.Price        
      };
      
    
    this.fireser.create_product(this.data,this.id);
    this.Name="";
    this.Price=0;
    alert("Successfully Added");



  }

}
