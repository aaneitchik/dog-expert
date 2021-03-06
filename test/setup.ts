import { createObjectUrlMock } from './url-mock';
import { MockIntersectionObserver } from './intersection-observer-mock';

URL.createObjectURL = createObjectUrlMock;

// @ts-expect-error: No need to mock properly, that's not what we test
window.IntersectionObserver = MockIntersectionObserver;
