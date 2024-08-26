import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropIndicatorComponent } from './drop-indicator.component';

describe('DropIndicatorComponent', () => {
  let component: DropIndicatorComponent;
  let fixture: ComponentFixture<DropIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropIndicatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
