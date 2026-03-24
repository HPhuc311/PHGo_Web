import API from './api'

export const getCars = () => API('/api/cars')

// CREATE
export const createCar = (formData) => {
    const token = localStorage.getItem("token")

    return API('/api/cars', {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// UPDATE
export const updateCar = (id, formData) => {
    const token = localStorage.getItem("token")

    return API(`/api/cars/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// DELETE
export const deleteCar = (id) => {
    const token = localStorage.getItem("token")

    return API(`/api/cars/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}