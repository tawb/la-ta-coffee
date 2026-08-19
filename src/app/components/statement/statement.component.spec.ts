import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatementComponent } from './statement.component';

describe('StatementComponent', () => {
  let component: StatementComponent;
  let fixture: ComponentFixture<StatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatementComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should split the sentence into individual words', () => {
    expect(component.words.length).toBeGreaterThan(1);
    expect(component.words[0]).toBe('We');
  });

  it('should render one span per word', () => {
    const spans = fixture.nativeElement.querySelectorAll('.w');
    expect(spans.length).toBe(component.words.length);
  });
});