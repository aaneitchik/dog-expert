const observe = jest.fn();
const unobserve = jest.fn();

class MockIntersectionObserver {
  // No need to mock properly, we're not testing IntersectionObserver
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  public constructor() {}

  public observe = observe;

  public unobserve = unobserve;
}

export { MockIntersectionObserver };
