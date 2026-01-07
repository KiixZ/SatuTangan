import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAsync, useMutation } from './useAsync';

describe('useAsync hook', () => {
  it('should initialize with correct default state', () => {
    const asyncFn = vi.fn().mockResolvedValue('test data');
    const { result } = renderHook(() => useAsync(asyncFn));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should execute async function and update state on success', async () => {
    const asyncFn = vi.fn().mockResolvedValue('test data');
    const { result } = renderHook(() => useAsync(asyncFn));

    result.current.execute();

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('test data');
    expect(result.current.error).toBeNull();
    expect(asyncFn).toHaveBeenCalledTimes(1);
  });

  it('should handle errors correctly', async () => {
    const error = new Error('Test error');
    const asyncFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(asyncFn));

    result.current.execute();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it('should execute immediately when immediate is true', async () => {
    const asyncFn = vi.fn().mockResolvedValue('immediate data');
    const { result } = renderHook(() => useAsync(asyncFn, true));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('immediate data');
    expect(asyncFn).toHaveBeenCalledTimes(1);
  });

  it('should reset state correctly', async () => {
    const asyncFn = vi.fn().mockResolvedValue('test data');
    const { result } = renderHook(() => useAsync(asyncFn));

    await result.current.execute();

    await waitFor(() => {
      expect(result.current.data).toBe('test data');
    });

    result.current.reset();

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should allow setting data manually', () => {
    const asyncFn = vi.fn().mockResolvedValue('test data');
    const { result } = renderHook(() => useAsync(asyncFn));

    result.current.setData('manual data');

    expect(result.current.data).toBe('manual data');
  });

  it('should pass arguments to async function', async () => {
    const asyncFn = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useAsync(asyncFn));

    await result.current.execute('arg1', 'arg2', 123);

    await waitFor(() => {
      expect(asyncFn).toHaveBeenCalledWith('arg1', 'arg2', 123);
    });
  });
});

describe('useMutation hook', () => {
  it('should initialize with correct default state', () => {
    const mutationFn = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useMutation(mutationFn));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should execute mutation and update state on success', async () => {
    const mutationFn = vi.fn().mockResolvedValue('mutation result');
    const { result } = renderHook(() => useMutation(mutationFn));

    const promise = result.current.mutate({ id: 1 });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe('mutation result');
    expect(result.current.error).toBeNull();
    expect(mutationFn).toHaveBeenCalledWith({ id: 1 });
    await expect(promise).resolves.toBe('mutation result');
  });

  it('should handle mutation errors and re-throw', async () => {
    const error = new Error('Mutation error');
    const mutationFn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useMutation(mutationFn));

    const promise = result.current.mutate({ id: 1 });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
    await expect(promise).rejects.toThrow();
  });

  it('should reset mutation state correctly', async () => {
    const mutationFn = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useMutation(mutationFn));

    await result.current.mutate({ id: 1 });

    await waitFor(() => {
      expect(result.current.data).toBe('result');
    });

    result.current.reset();

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
