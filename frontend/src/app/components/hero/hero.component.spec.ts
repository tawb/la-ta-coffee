import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should start on the first drink', () => {
    fixture.detectChanges();
    expect(component.currentIndex()).toBe(0);
  });

  it('should advance to the next drink when goTo is called', () => {
    fixture.detectChanges();
    component.goTo(3);
    expect(component.currentIndex()).toBe(3);
  });

  it('should wrap around to the first drink after the last one', fakeAsync(() => {
    fixture.detectChanges();
    component.goTo(component.drinks.length - 1);

    tick(2120);//pretend 2120 milliseconds have just passed

    expect(component.currentIndex()).toBe(0);
  }));

  afterEach(() => {
    fixture.destroy();
  });
});