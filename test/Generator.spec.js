import assert from 'assert';
import Generator from '../lib';

describe('Generator', () => {
  describe('#constructor()', () => {
    it('should create a new Generator object', () => {
      assert(new Generator instanceof Generator);
    });
  });
});
