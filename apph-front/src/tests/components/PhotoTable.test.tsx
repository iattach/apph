import { triggerRequestFailure, triggerRequestSuccess } from '../utils';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import * as React from 'react';
import { PhotoTable } from '../../static/components/PhotoTable';

describe('Tests du composant PhotoTable.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Tests array display when data are send', () => {
    //GIVEN
    triggerRequestSuccess(
      '{"photoList":[{"id":3,"title":"photo1","description":"photo test 1","creationDate":"2022-05-09T08:30:00.814+00:00","shootingDate":"2022-05-09T08:30:00.814+00:00","size":1300.0,"tags":"img1","url":"fake url"},{"id":4,"title":"photo2","description":"photo test 2","creationDate":"2022-05-09T08:30:00.814+00:00","shootingDate":"2022-05-09T08:30:00.814+00:00","size":1300.0,"tags":"img2","url":"fake url"}],"totalSize":3}'
    );
    //WHEN
    render(<PhotoTable />);
    //THEN
    expect(screen.getByText(/photo1/)).toBeInTheDocument();
    expect(screen.getByText(/photo2/)).toBeInTheDocument();
  });

  it('Test with error server', () => {
    //GIVEN
    triggerRequestFailure('{"message": "Argument illégal."}');
    //WHEN
    render(<PhotoTable />);
    //THEN
    expect(screen.getByText(/Argument illégal./));
  });
});
