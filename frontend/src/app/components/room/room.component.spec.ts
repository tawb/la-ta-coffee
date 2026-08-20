import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoomComponent } from './room.component';

describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the headline text', () => {
    const heading: HTMLElement = fixture.nativeElement.querySelector('.room-h');
    expect(heading.textContent).toContain('Different pace');
    expect(heading.textContent).toContain('One table');
  });

  afterEach(() => {
    fixture.destroy();
  });
});