import { Component, OnInit } from '@angular/core';
import {FireserviceService} from '../fireservice.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts"; 
export interface Product{
  name:string;
  price:number;
  quantity:number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
name:string;
email:string;
mbno:string;
address:string;
retrievedata:any;
dataSource:any;

@ViewChild(MatPaginator) paginator: MatPaginator;

mainquan:string[];
quantnum:number[];
stream:any;
bill:number;
np=[];
quantity="";
calculate=true;

displayedColumns: string[] = ['name','mbno','email','address','TotalBill','paymentstatus','actions'];
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

dropdownSettings:IDropdownSettings;
selectedItems = [];
public products:Observable<any>;

  
  constructor(public fireser:FireserviceService,public af:AngularFirestore) {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
     this.fireser.getproducts().subscribe(products=>{
       this.products=products;
  //     console.log(this.products);

     })

     this.fireser.getCustomers().subscribe(customers=>{
      this.retrievedata=customers;
      console.log(this.retrievedata);
      this.dataSource = new MatTableDataSource(this.retrievedata);
   })
  }
  generatePDF(element) {  
    let docDefinition = {  
      content: [  
        {  
          text: 'OneKart',  
          fontSize: 20,  
          alignment: 'center',  
          color: '#047886'  
          
        },  
        {  
          text: 'INVOICE',  
          fontSize: 15,  
          bold: true,  
          alignment: 'center',  
          decoration: 'underline',
          color: 'skyblue'  
        },
        {  
          text: 'Customer Details',  
          style: 'sectionHeader'  
      } ,
      {  
        columns: [  
            [  
                {  
                    text: element.name,  
                    bold: true  
                },  
                { text: element.address },  
                { text: element.email },  
                { text: element.mbno }  
            ],  
            [  
                {  
                    text: `Date: ${new Date().toLocaleString()}`,  
                    alignment: 'right'  
                },  
                {  
                    text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,  
                    alignment: 'right'  
                }  
            ]  
        ]  
    },   
    {  
      text: 'Order Details',  
      style: 'sectionHeader'  
  },  
  {  
      table: {  
          headerRows: 1,  
          widths: ['*', 'auto', 'auto', 'auto'],  
          body: [  
              ['Product', 'Price', 'Quantity', 'Amount'],  
              ...element.Details.map(p => ([p.names, p.price, p.quantity, (p.price * p.quantity).toFixed(2)])),  
              [{ text: 'Total Amount', colSpan: 3 }, {}, {}, element.Details.reduce((sum, p) => sum + (p.quantity * p.price), 0).toFixed(2)]  
          ]  
      }  
  }  ,
  {  
    columns: [  
        [{ qr: `${element.name}`, fit: '50' }],  
        [{ text: 'Signature', alignment: 'right', italics: true }],  
    ]  
},  
{  
  ul: [  
    'Order can be return in max 10 days.',  
    'Warrenty of the product will be subject to the manufacturer terms and conditions.',  
    'This is system generated invoice.',  
  ],  
}  
      ],
      styles: {  
        sectionHeader: {  
            bold: true,  
            decoration: 'underline',  
            fontSize: 14,  
            margin: [0, 15, 0, 15]  
        }  
    }  
    }
   
    pdfMake.createPdf(docDefinition).open();
  }  
  Payment(element)
  {
    let record={};
    if(element.paymentstatus=="Completed")
    {
      alert("Payment already Received");
    }
    else
    {
    if(confirm("Confirm Payment Received ? "))
    {
      alert("inside ");
      record['id']=element.id
      record['name']=element.name;
      record['email']=element.email;
      record['mbno']=element.mbno;
      record['address']=element.address;
      record['TotalBill']=element.TotalBill;
      record['Details']=element.Details;
      record['paymentstatus']="Completed";
      this.fireser.update_customer(record,element.id);
    }
  }

  }
   createcus()
   {
     let record={},id="";
     id=this.af.createId();
     record['id']=id
     record['name']=this.name;
     record['email']=this.email;
     record['mbno']=this.mbno;
     record['address']=this.address;
     record['TotalBill']=this.bill;
     record['Details']=this.np;
     record['paymentstatus']="pending";

    this.fireser.create_customer(record,id);
     //console.log(this.selectedItems)
     alert("Successfully Added");

   }

   edit(element)
   {
     alert(element.id);
   }

   calculateBill()
   {
    let i=0,total=0,tmp={};
    if(this.quantity!='' && this.selectedItems.length!=0)
    {
      this.mainquan=(this.quantity.split(','));
      this.calculate=false;
    
    console.log(this.mainquan);
    if(this.mainquan.length==this.selectedItems.length)
    {
      
    
      this.selectedItems.forEach(element => {
       total=total+element.price*Number(this.mainquan[i]);
       tmp['price']=element.price;
       tmp['names']=element.names;
       tmp['quantity']=Number(this.mainquan[i]);
       i=i+1;
       console.log(tmp);
     this.np.push(tmp);  
     tmp={};
     });

     //console.log(total);
     //record['total']=total;
     this.bill=total;
    console.log(this.np);

    }
    else{
      alert("Please enter Quantity for each selected Product!");
    }
    }
    else{
      alert("Please Select Product and Quantity!");
    }
     
    
   }

  ngOnInit(): void {

    
    console.log(this.fireser.getproducts());
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'price',
      textField: 'names',
      
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
  
  }
  



      
      

  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }
  onClickSubmit()
{
alert(this.name);
}
}
