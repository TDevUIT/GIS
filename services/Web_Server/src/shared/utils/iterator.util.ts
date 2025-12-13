export class PaginatedIterator<T> implements AsyncIterableIterator<T[]> {
  private currentPage = 1;
  private hasMore = true;

  constructor(
    private readonly fetchPage: (page: number, limit: number) => Promise<{
      items: T[];
      total: number;
    }>,
    private readonly pageSize: number = 10,
  ) {}

  async next(): Promise<IteratorResult<T[]>> {
    if (!this.hasMore) {
      return { done: true, value: undefined };
    }

    const result = await this.fetchPage(this.currentPage, this.pageSize);

    if (result.items.length === 0 || result.items.length < this.pageSize) {
      this.hasMore = false;
    }

    this.currentPage++;

    return {
      done: false,
      value: result.items,
    };
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T[]> {
    return this;
  }

  async toArray(): Promise<T[]> {
    const allItems: T[] = [];

    for await (const items of this) {
      allItems.push(...items);
    }

    return allItems;
  }

  async forEach(
    callback: (items: T[], page: number) => Promise<void> | void,
  ): Promise<void> {
    let page = 1;
    for await (const items of this) {
      await callback(items, page);
      page++;
    }
  }

  async map<U>(transform: (item: T) => U): Promise<U[]> {
    const allItems = await this.toArray();
    return allItems.map(transform);
  }

  async filter(predicate: (item: T) => boolean): Promise<T[]> {
    const allItems = await this.toArray();
    return allItems.filter(predicate);
  }
}

export function createPaginatedIterator<T>(
  fetchPage: (page: number, limit: number) => Promise<{
    items: T[];
    total: number;
  }>,
  pageSize = 10,
): PaginatedIterator<T> {
  return new PaginatedIterator(fetchPage, pageSize);
}

export class ChunkedIterator<T> implements IterableIterator<T[]> {
  private currentIndex = 0;

  constructor(
    private readonly array: T[],
    private readonly chunkSize: number,
  ) {}

  next(): IteratorResult<T[]> {
    if (this.currentIndex >= this.array.length) {
      return { done: true, value: undefined };
    }

    const chunk = this.array.slice(
      this.currentIndex,
      this.currentIndex + this.chunkSize,
    );
    this.currentIndex += this.chunkSize;

    return {
      done: false,
      value: chunk,
    };
  }

  [Symbol.iterator](): IterableIterator<T[]> {
    return this;
  }

  forEach(callback: (chunk: T[], index: number) => void): void {
    let index = 0;
    for (const chunk of this) {
      callback(chunk, index);
      index++;
    }
  }
}

export function createChunkedIterator<T>(
  array: T[],
  chunkSize: number,
): ChunkedIterator<T> {
  return new ChunkedIterator(array, chunkSize);
}
