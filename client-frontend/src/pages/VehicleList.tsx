import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { VehicleCard } from '../components/VehicleCard'
import { createVehicle, deleteVehicle, fetchVehicles, updateVehicle } from '../services/apiService'
import type { CreateVehicleInput, Vehicle } from '../types'

const initialForm: CreateVehicleInput = {
  name: '',
  type: 'Heavy Truck',
  status: 'Active',
  location: '',
  fuelLevel: 50,
  mileage: 0,
  driverId: '',
}

function formatVehicleNumericInput(value: string, options?: { maxValue?: number }) {
  if (!value) {
    return ''
  }

  if (!/^\d*\.?\d*$/.test(value)) {
    return value
  }

  const limitedValue = (() => {
    if (!value.includes('.')) {
      return value
    }

    const [integerPart, fractionalPart] = value.split('.', 2)
    return `${integerPart}.${fractionalPart.slice(0, 2)}`
  })()

  if (limitedValue === '.') {
    return '0.'
  }

  const normalizedValue = limitedValue.startsWith('.') ? `0${limitedValue}` : limitedValue
  const parsedValue = Number(normalizedValue)

  if (Number.isNaN(parsedValue)) {
    return normalizedValue
  }

  if (typeof options?.maxValue === 'number' && parsedValue > options.maxValue) {
    return String(options.maxValue)
  }

  if (parsedValue >= 10) {
    if (normalizedValue.includes('.')) {
      const [integerPart, fractionalPart] = normalizedValue.split('.', 2)
      return `${String(Number(integerPart))}.${fractionalPart}`
    }

    return String(parsedValue)
  }

  if (normalizedValue.includes('.')) {
    const [integerPart, fractionalPart] = normalizedValue.split('.', 2)
    const paddedIntegerPart =
      integerPart && integerPart !== '0' ? integerPart.padStart(2, '0') : integerPart

    return `${paddedIntegerPart}.${fractionalPart}`
  }

  if (/^\d$/.test(normalizedValue) && normalizedValue !== '0') {
    return normalizedValue.padStart(2, '0')
  }

  if (/^0\d+$/.test(normalizedValue)) {
    return String(parsedValue).padStart(2, '0')
  }

  return normalizedValue
}

export function VehicleList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null)
  const [deletingVehicleId, setDeletingVehicleId] = useState<string | null>(null)
  const [fuelLevelInput, setFuelLevelInput] = useState('50')
  const [mileageInput, setMileageInput] = useState('0')
  const [form, setForm] = useState<CreateVehicleInput>(initialForm)
  const [error, setError] = useState('')
  const query = searchParams.get('q')?.trim().toLowerCase() ?? ''

  useEffect(() => {
    void fetchVehicles().then(setVehicles)
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const parsedFuelLevel = Number(fuelLevelInput)
    if (!fuelLevelInput.trim() || Number.isNaN(parsedFuelLevel) || parsedFuelLevel < 0 || parsedFuelLevel > 100) {
      setError('Fuel level must be a valid percentage between 0 and 100.')
      return
    }

    const parsedMileage = Number(mileageInput)
    if (!mileageInput.trim() || Number.isNaN(parsedMileage) || parsedMileage < 0) {
      setError('Mileage must be a valid non-negative number.')
      return
    }

    const nextForm = {
      ...form,
      fuelLevel: parsedFuelLevel,
      mileage: parsedMileage,
    }

    try {
      if (editingVehicleId) {
        const updatedVehicle = await updateVehicle(editingVehicleId, nextForm)
        setVehicles((current) =>
          current.map((vehicle) => (vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle)),
        )
      } else {
        const createdVehicle = await createVehicle(nextForm)
        setVehicles((current) => [...current, createdVehicle])
      }

      resetForm()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to save vehicle.')
    }
  }

  async function handleDelete(vehicle: Vehicle) {
    setError('')
    setDeletingVehicleId(vehicle.id)

    try {
      await deleteVehicle(vehicle.id)
      setVehicles((current) => current.filter((item) => item.id !== vehicle.id))
      if (editingVehicleId === vehicle.id) {
        resetForm()
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete vehicle.')
    } finally {
      setDeletingVehicleId((current) => (current === vehicle.id ? null : current))
    }
  }

  function handleEdit(vehicle: Vehicle) {
    setForm({
      name: vehicle.name,
      type: vehicle.type,
      status: vehicle.status,
      location: vehicle.location,
      fuelLevel: vehicle.fuelLevel,
      mileage: vehicle.mileage,
      driverId: vehicle.driverId,
    })
    setFuelLevelInput(formatVehicleNumericInput(String(vehicle.fuelLevel), { maxValue: 100 }))
    setMileageInput(formatVehicleNumericInput(String(vehicle.mileage)))
    setEditingVehicleId(vehicle.id)
    setShowForm(true)
    setError('')
  }

  function resetForm() {
    setForm(initialForm)
    setFuelLevelInput(formatVehicleNumericInput(String(initialForm.fuelLevel), { maxValue: 100 }))
    setMileageInput(formatVehicleNumericInput(String(initialForm.mileage)))
    setEditingVehicleId(null)
    setShowForm(false)
    setError('')
  }

  const filteredVehicles = query
    ? vehicles.filter(
        (vehicle) =>
          vehicle.id.toLowerCase().includes(query) ||
          vehicle.name.toLowerCase().includes(query) ||
          vehicle.location.toLowerCase().includes(query) ||
          vehicle.driverId.toLowerCase().includes(query),
      )
    : vehicles

  return (
    <div className="page">
      <PageHeader
        eyebrow="Assets"
        title="Vehicle list"
        description="Browse all connected fleet units, review health indicators, and jump into detail pages."
        actionLabel={showForm ? 'Close form' : 'Add vehicle'}
        onAction={() => {
          if (showForm) {
            resetForm()
          } else {
            setShowForm(true)
          }
        }}
      />
      {query ? (
        <div className="panel search-summary">
          <div>
            <h3>Vehicle search results</h3>
            <p className="muted">
              Showing {filteredVehicles.length} result{filteredVehicles.length === 1 ? '' : 's'} for "{searchParams.get('q')}".
            </p>
          </div>
          <button className="secondary-button" onClick={() => setSearchParams({})} type="button">
            Clear search
          </button>
        </div>
      ) : null}
      {showForm ? (
        <form className="panel inline-form" onSubmit={handleSubmit}>
          <div className="panel__header">
            <div>
              <h3>{editingVehicleId ? `Edit ${editingVehicleId}` : 'Add a vehicle'}</h3>
              <p className="muted">Create or update a fleet asset in the live application.</p>
            </div>
          </div>
          <div className="form-grid">
            <label className="input-group">
              <span>Name</span>
              <input onChange={(event) => setForm({ ...form, name: event.target.value })} required type="text" value={form.name} />
            </label>
            <label className="input-group">
              <span>Type</span>
              <input onChange={(event) => setForm({ ...form, type: event.target.value })} required type="text" value={form.type} />
            </label>
            <label className="input-group">
              <span>Status</span>
              <select onChange={(event) => setForm({ ...form, status: event.target.value as Vehicle['status'] })} value={form.status}>
                <option value="Active">Active</option>
                <option value="Idle">Idle</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </label>
            <label className="input-group">
              <span>Location</span>
              <input onChange={(event) => setForm({ ...form, location: event.target.value })} required type="text" value={form.location} />
            </label>
            <label className="input-group">
              <span>Fuel level (%)</span>
              <input
                max="100"
                min="0"
                onChange={(event) =>
                  setFuelLevelInput(formatVehicleNumericInput(event.target.value, { maxValue: 100 }))
                }
                required
                step="0.01"
                type="number"
                value={fuelLevelInput}
              />
            </label>
            <label className="input-group">
              <span>Mileage</span>
              <input
                min="0"
                onChange={(event) => setMileageInput(formatVehicleNumericInput(event.target.value))}
                required
                step="0.01"
                type="number"
                value={mileageInput}
              />
            </label>
            <label className="input-group">
              <span>Driver ID</span>
              <input onChange={(event) => setForm({ ...form, driverId: event.target.value })} required type="text" value={form.driverId} />
            </label>
          </div>
          {error ? <div className="form-error">{error}</div> : null}
          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingVehicleId ? 'Save changes' : 'Save vehicle'}
            </button>
            <button className="secondary-button" onClick={resetForm} type="button">
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      <section className="list-grid">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            isDeleting={deletingVehicleId === vehicle.id}
            key={vehicle.id}
            onDelete={handleDelete}
            onEdit={handleEdit}
            vehicle={vehicle}
          />
        ))}
      </section>
      {filteredVehicles.length === 0 ? (
        <div className="empty-state">
          No vehicles matched this search. Try a vehicle ID, driver ID, or location.
        </div>
      ) : null}
    </div>
  )
}
