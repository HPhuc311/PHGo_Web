import API from './api'

export const createTrip = (data) => {
    const token = localStorage.getItem("token")

    return API('/api/trips', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getMyTrips = () =>
    API('/api/trips/my')

export const cancelTrip = (id) =>
    API(`/api/trips/${id}/cancel`, {
        method: 'PUT'
    })

// ADMIN
export const getAllTrips = () =>
    API('/api/trips/admin')

export const updateTripStatus = (id, status) =>
    API(`/api/trips/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    })