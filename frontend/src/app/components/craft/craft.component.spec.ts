import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CraftComponent } from './craft.component';

describe('CraftComponent', () => {
  let component: CraftComponent;
  let fixture: ComponentFixture<CraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CraftComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build scatter characters for both phrases', () => {
    expect(component.charsA.length).toBe('One bean.'.length);
    expect(component.charsB.length).toBe('One pour.'.length);
  });

  it('should mark all charsB characters as accented', () => {
    const allAccented = component.charsB.every(c => c.accent === true);
    expect(allAccented).toBe(true);
  });

  afterEach(() => {
    fixture.destroy();
  });
});