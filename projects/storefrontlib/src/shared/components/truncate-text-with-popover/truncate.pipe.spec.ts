import { TruncatePipe } from './truncate.pipe';

const mockText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('should not transform anything', () => {
    expect(pipe.transform(mockText)).toBe(mockText);
  });

  it('should transforms text to be shorten to 10 characters with trail', () => {
    expect(pipe.transform(mockText, [10]).length).toEqual(13);
  });

  it('should transforms text to be shorten to 10 characters without trail', () => {
    expect(pipe.transform(mockText, [10, false]).length).toEqual(10);
  });

  it('should transforms text to be shorten to 20 characters with trail', () => {
    expect(pipe.transform(mockText, ['test']).length).toEqual(23);
    expect(pipe.transform(mockText, [null, null]).length).toEqual(23);
    expect(pipe.transform(mockText, [undefined, undefined]).length).toEqual(23);
    expect(pipe.transform(mockText, ['test', 'test']).length).toEqual(23);
  });
});
