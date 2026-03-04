import type { EventSeriesApi } from '../api/event-series-api';
import type {
    CreateEventSeriesDto,
    EventSeriesDto,
    EventDto,
    GetEventSeriesDto,
    UpdateEventSeriesDto,
} from '../models';
import { unwrap } from './errors';

export class EnhancedEventSeriesApi {
    constructor(private readonly api: EventSeriesApi) {}

    async createSeries(
        requesterUserId: string,
        data: CreateEventSeriesDto
    ): Promise<string> {
        return unwrap(this.api.create(requesterUserId, data));
    }

    async getSeries(seriesId: string): Promise<EventSeriesDto> {
        return unwrap(this.api.get(seriesId));
    }

    async updateSeries(
        seriesId: string,
        requesterUserId: string,
        data: UpdateEventSeriesDto
    ): Promise<string> {
        return unwrap(this.api.update(seriesId, requesterUserId, data));
    }

    async deleteSeries(seriesId: string, requesterUserId: string): Promise<void> {
        return unwrap(this.api.remove(seriesId, requesterUserId));
    }

    async getInstances(seriesId: string, from?: string, to?: string): Promise<EventDto[]> {
        return unwrap(this.api.getInstances(seriesId, from, to));
    }

    async getBatch(seriesIds: string[]): Promise<EventSeriesDto[]> {
        return unwrap(this.api.getBatch({ seriesIds }));
    }
}
