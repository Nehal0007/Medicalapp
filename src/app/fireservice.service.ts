import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Product } from './home/home.component';



@Injectable({
  providedIn: 'root'
})
export class FireserviceService {

  products:Observable<any>;
  customers:Observable<any>;
  id:any;
  

  constructor(public fireservice:AngularFirestore) { 

    this.products =this.fireservice.collection('Products').valueChanges();
    this.customers =this.fireservice.collection('Customers').valueChanges();
  }

  create_customer(data,id)
  {

    this.fireservice.collection('Customers').doc(id).set(data);
  }
  
 
  create_product(data,id)
  {
  
    this.fireservice.collection('Products').doc(id).set(data);
   
     
  }
  getproducts(){ 
    return this.products;
  }
  getCustomers()
  {
    return this.customers;
  }

  update_product(data,id)
  {
    this.fireservice.collection('Products').doc(id).update(data);
  }
  delete_product(id)
  {
    this.fireservice.collection('Products').doc(id).delete();
  }
  update_customer(data,id)
  {
    this.fireservice.collection('Customers').doc(id).update(data);

  }
}
