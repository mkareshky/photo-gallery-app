// src/hooks/__tests__/usePhotos.test.ts
import { renderHook, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import { usePhotos } from '../usePhotos';
import addMetadataToPhotos from '../../helper/addMetadataToPhotos';

jest.mock('axios');
jest.mock('../../helper/addMetadataToPhotos');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAddMetadataToPhotos = addMetadataToPhotos as jest.Mock;

const mockPhotos = [{ id: '1', author: 'Author1' }];
const enhancedPhotos = [{ id: '1', author: 'Author1', title: 'Photo by Author1' }];

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('usePhotos', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAddMetadataToPhotos.mockReset();
    mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);
  });

  test('fetches initial photos successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPhotos });
    mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);

    const { result } = renderHook(() => usePhotos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.photos).toEqual(enhancedPhotos);
  });

  test('handles empty data response correctly', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => usePhotos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.photos).toEqual([]);
    expect(result.current.hasMore).toBe(false);
  });

  test('handles fetch error correctly', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const { result } = renderHook(() => usePhotos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to fetch photos. Please try again later.');
  });

  test('retry clears error and refetches successfully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Failure'));

    const { result } = renderHook(() => usePhotos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to fetch photos. Please try again later.');

    mockedAxios.get.mockResolvedValueOnce({ data: mockPhotos });
    mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);

    act(() => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.photos).toEqual(enhancedPhotos);
    expect(result.current.hasMore).toBe(true);
  });

  test('prevents fetching already fetched page', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPhotos });
    mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);

    const { result } = renderHook(() => usePhotos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    // loadMore (page=2)
    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedAxios.get).toHaveBeenCalledTimes(3);

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedAxios.get).toHaveBeenCalledTimes(4);

    expect(mockedAxios.get.mock.calls[0][0]).toContain('page=1');
    expect(mockedAxios.get.mock.calls[1][0]).toContain('page=2');
    expect(mockedAxios.get.mock.calls[2][0]).toContain('page=3');
    expect(mockedAxios.get.mock.calls[3][0]).toContain('page=4');
  });

  test('loadMore increments page and fetches correctly', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPhotos });
    mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);

    const { result } = renderHook(() => usePhotos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
    expect(result.current.photos.length).toBeGreaterThan(0);
  });

  test('loadMore does nothing if hasMore is false', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(() => usePhotos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasMore).toBe(false);

    act(() => result.current.loadMore());

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });

  test('does not refetch a page that has already been fetched', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPhotos });
    mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);

    const { result } = renderHook(() => usePhotos());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.fetchPhotos(1);
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
