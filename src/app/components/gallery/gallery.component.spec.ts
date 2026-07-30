import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have exactly 10 cups', () => {
    expect(component.cups.length).toBe(10);
  });

  it('should correctly compute the sprite position for the first and last slot', () => {
    expect(component.slotPosition(0)).toBe('0%');
    expect(component.slotPosition(9)).toBe('100%');
  });

  afterEach(() => {
    fixture.destroy();
  });
});