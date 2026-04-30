describe('HuespedesService', () => {
  let service: HuespedesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HuespedesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});