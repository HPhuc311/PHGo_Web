import API from './api'

// GET CARS
export const getCars = () =>
    API('/api/cars')

// ADMIN CREATE CAR
export const createCar = (formData) =>
    fetch('http://localhost:5000/api/cars', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    }).then(res => res.json())

// UPDATE
export const updateCar = (id, formData) =>
    fetch(`http://localhost:5000/api/cars/${id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    }).then(res => res.json())

// DELETE
export const deleteCar = (id) =>
    API(`/api/cars/${id}`, {
        method: 'DELETE'
    })