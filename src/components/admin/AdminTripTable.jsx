import { Select, Tag, Button, Tooltip } from "antd"
import { DeleteOutlined } from "@ant-design/icons"
import SearchBox from "../common/SearchBox"
import { useEffect, useState } from "react"

const AdminTripTable = ({
    trips,
    statusFlow,
    handleChangeStatus,
    handleDeleteTrip,
    getStatusColor
}) => {

    const [filteredTrips, setFilteredTrips] = useState(trips)


    useEffect(() => {
        setFilteredTrips(trips)
    }, [trips])

    return (
        <>
            <SearchBox
                data={trips}
                fields={['user.name', 'pickup', 'destination']}
                onFiltered={setFilteredTrips}
                placeholder="Search trips..."
            />

            <div style={tripContainer}>
                <table style={table}>
                    <thead>
                        <tr style={theadRow}>
                            <th style={{ width: "20%" }}>User</th>
                            <th style={{ width: "20%" }}>Pickup</th>
                            <th style={{ width: "20%" }}>Destination</th>
                            <th style={{ width: "20%", textAlign: "center" }}>Status</th>
                            <th style={{ width: "20%", textAlign: "center" }}>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTrips.map(trip => {
                            const next = statusFlow[trip.status] || []

                            return (
                                <tr key={trip._id} style={row}>
                                    <td style={cell}>{trip.user?.name}</td>
                                    <td style={cell}>{trip.pickup}</td>
                                    <td style={cell}>{trip.destination}</td>

                                    <td style={{ ...cell, textAlign: "center" }}>
                                        <Tag color={getStatusColor(trip.status)}>
                                            {trip.status}
                                        </Tag>
                                    </td>

                                    <td style={{ ...cell, textAlign: "center" }}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 8
                                        }}>
                                            {next.length === 0 ? (
                                                <span style={{ color: "#999" }}>Done</span>
                                            ) : (
                                                <Select
                                                    style={{ width: 140 }}
                                                    placeholder="Update"
                                                    onChange={(v) => handleChangeStatus(trip._id, v)}
                                                >
                                                    {next.map(s => (
                                                        <Select.Option key={s} value={s}>
                                                            {s}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            )}

                                            {['completed', 'cancelled'].includes(trip.status) && (
                                                <Tooltip title="Delete trip">
                                                    <Button
                                                        danger
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDeleteTrip(trip)}
                                                    />
                                                </Tooltip>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AdminTripTable

// ===== STYLE =====
const tripContainer = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
}

const table = {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed"
}

const theadRow = {
    color: "#666",
    fontSize: 13,
    borderBottom: "2px solid #eee"
}

const row = {
    borderBottom: "1px solid #eee",
    height: 60
}

const cell = {
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
}
