import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-orgdashboard',
  templateUrl: './orgdashboard.component.html',
  styleUrls: ['./orgdashboard.component.css']
})
export class orgdashboardComponent implements OnInit {
  @Input() orgInView: string;

  constructor() {
    console.log("lalalala")
    console.log(this.orgInView, "myachikne");
   }

  ngOnInit(): void {
  }
  
  ngAfterInit(): void{
    
  }
}
