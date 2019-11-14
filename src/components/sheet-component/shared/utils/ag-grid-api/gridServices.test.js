import { getGridAPI, setGridAPI } from './gridServices';

describe('Getter & Setter of gridServices', () => {
  test('getGridAPI should return null', () => {
    const GridAPI = getGridAPI();
    expect(GridAPI).toBe(null);
  });

  test('setGridAPI should set Value', () => {
    setGridAPI('AG_GRID_API');
    const GridAPI = getGridAPI();
    expect(GridAPI).toBe('AG_GRID_API');
  });
});
