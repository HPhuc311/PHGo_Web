import API from './api'

export const createTrip = (data) =>
    API('/api/trips', {
        method: 'POST',
        body: JSON.stringify(data)
    })

export const getMyTrips = () =>
    API('/api/trips/my')

export const cancelTrip = (id) =>
    API(`/api/trips/${id}/cancel`, {
        method: 'PUT'
    })