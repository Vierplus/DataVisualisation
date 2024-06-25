import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerCostsGraphComponent } from './power-costs-graph.component';

describe('PowerCostsGraphComponent', () => {
  let component: PowerCostsGraphComponent;
  let fixture: ComponentFixture<PowerCostsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerCostsGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PowerCostsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
