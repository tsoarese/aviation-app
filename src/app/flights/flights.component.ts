import { Component, OnInit, ViewChild } from '@angular/core';
import { AviationstackService } from '../services/aviationstack.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.css']
})
export class FlightsComponent implements OnInit {
  keyword ="airport_name";
  airports: any;
  flights: any;
  isArrivals = false;
  isDepartures = false;
  totalFlights: any;
  airportNameSel = "";
  airportCodeSel = "";
  iataControl = new FormControl();
  pager?: Pager;
  initialPage = 1;
  pageSize = 20;
  maxPages = 10;
  isIataNotFount = false;
  isLoad = false;
  constructor(private aviationStackService: AviationstackService) { }

  ngOnInit(): void {
    this.isArrivals=false;
    this.isDepartures=false;
    this.getAirports();
  }

  setType(page:any, type: string) {
    this.isDepartures=false;
    this.isArrivals=false;
    this.isLoad = true;
    if(type=="DEPARTURES"){
      this.getFlights(page, type,'dep_iata='+this.airportCodeSel, 0);
    } else if(type=="ARRIVALS"){
      this.getFlights(page, type,'arr_iata='+this.airportCodeSel, 0);
    }
  }

  changeType(e:any) {
    console.log(e.target.value);
  }

  private getAirports() {
    this.airports = [];
    this.aviationStackService
      .airports()
      .then((airports) => {
        airports.data.forEach((data: any) => {
          this.airports.push({
            airport_name: data.airport_name,
            iata_code: data.iata_code,
            desc_item: data.airport_name + " (" + data.iata_code + ")"
          });
        });
      })
      .catch((error) => {
        console.log('error get airports:', error);
      });
  }

  private getFlights(pag:any, type:any, iata:any, offset:any) {
    this.aviationStackService
      .flights(iata, offset)
      .then(async (flights) => {
        this.flights = flights.data;
        this.totalFlights = flights.pagination.total;
        this.setPage(pag);
        if(type=="DEPARTURES"){
          this.isLoad = false;
          this.isDepartures=true;
          this.isArrivals=false;
        } else if(type=="ARRIVALS"){
          this.isLoad = false;
          this.isDepartures=false;
          this.isArrivals=true;
        }
      })
      .catch((error) => {
        this.isDepartures=false;
        this.isArrivals=false;
        this.isLoad = false;
        console.log('error get airports names:', error);
      });
  }

  searchFlights(page: number) {
    // do something with selected item
    let offset = (page - 1) * this.pageSize;
    this.isArrivals=false;
    this.isDepartures=false;
    this.isIataNotFount=false;
    this.isLoad = true;
    console.log("iata ctr",this.iataControl);
    console.log("iata",this.iataControl.value);
    this.flights = [];
    this.totalFlights=0;
    this.setPage(0);
    if(this.iataControl.value){
      console.log("auto iata",this.iataControl.value);
      this.airportNameSel="";
      this.airportCodeSel=this.iataControl.value;
      for (let i = 0; i < this.airports.length; i++) {
        if (this.airports[i].iata_code == this.iataControl.value) {
          this.airportNameSel=this.airports[i].airport_name;
          break;
        }
      }
      if(this.airportNameSel){
        this.getFlights(page,"ARRIVALS",'arr_iata='+this.airportCodeSel, offset);
      } else {
        this.isLoad = false;
        this.isIataNotFount=true;
        console.log("iata not fount");  
      }
    } else if(this.airportCodeSel){
      console.log("auto iata",this.airportCodeSel);
      this.getFlights(page,"ARRIVALS",'arr_iata='+this.airportCodeSel, offset);
    } else {
      this.isLoad = false;
    }
  }

  selectEvent(item: any) {
    // do something with selected item
    console.log("item", item);
    this.airportNameSel = item.airport_name;
    this.airportCodeSel = item.iata_code;
    this.isArrivals=false;
    this.isDepartures=false;
    this.iataControl.setValue('');
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  onFocused(e:any){
    // do something when input is focused
  }  

  onCleared(e:any){
    // do something when input is focused
    console.log("Clear")
    this.airportNameSel = "";
    this.airportCodeSel = "";
    this.isArrivals=false;
    this.isDepartures=false;
    this.iataControl.setValue('');
  }

  setPage(page: number) {
    if (this.totalFlights==0)
        return;
    // get new pager object for specified page
    //this.pager = this.paginate(this.items.length, page, this.pageSize, this.maxPages);
    this.pager = this.paginate(this.totalFlights, page, this.pageSize, this.maxPages);
  }

  paginate(totalItems: number, currentPage: number = 1, pageSize: number = 10, maxPages: number = 10): Pager {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // total pages more than max so calculate start and end pages
        let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = maxPages;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            // current page somewhere in the middle
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
        totalItems,
        currentPage,
        pageSize,
        totalPages,
        startPage,
        endPage,
        startIndex,
        endIndex,
        pages
    };
  }    
}

export interface Pager {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
}
