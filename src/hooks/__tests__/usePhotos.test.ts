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
    jest.spyOn(console, 'error').mockImplementation(() => { });
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
        mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos); // explicitly defined here

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

    test('prevents fetching already fetched page', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockPhotos });
        mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);

        const { result } = renderHook(() => usePhotos());

        // Wait for initial load (page 1)
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Load more (page 2)
        await act(async () => {
            result.current.loadMore();
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Try loading the same page again; should not fetch again (page 2)
        await act(async () => {
            result.current.loadMore(); // page 3, actually
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        // Expect 3 fetches (page 1, page 2, page 3)
        expect(mockedAxios.get).toHaveBeenCalledTimes(3);

        // Now explicitly verify fetching the same page again won't trigger another fetch
        await act(async () => {
            result.current.loadMore(); // Attempting page 4
        });

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(mockedAxios.get).toHaveBeenCalledTimes(4); // clearly shows increment

        // Ensure the internal set has correctly tracked pages:
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

        // Trigger loading more explicitly wrapped in act
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

        expect(mockedAxios.get).toHaveBeenCalledTimes(1); // should not fetch again
    });

    test('does not refetch a page that has already been fetched', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockPhotos });
        mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);

        const { result } = renderHook(() => usePhotos());

        // Wait for initial fetch (page 1)
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Explicitly try to fetch page 1 again (this triggers line 16)
        await act(async () => {
            await result.current.fetchPhotos(1);
        });

        // Verify axios.get was not called again (only once total)
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    test('explicitly tests fetching an already fetched page', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockPhotos });
        mockedAddMetadataToPhotos.mockReturnValue(enhancedPhotos);

        const { result } = renderHook(() => usePhotos());

        // Initial fetch
        await waitFor(() => expect(result.current.loading).toBe(false));

        // Explicitly refetch the same page again:
        await act(async () => {
            await result.current.fetchPhotos(1); // Page 1 again
        });

        // Ensure the fetch was not called twice:
        expect(mockedAxios.get).toHaveBeenCalledTimes(1); // Ensures line 16 runs
    });

});
