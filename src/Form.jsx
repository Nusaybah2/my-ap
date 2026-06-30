import { useEffect, useState } from "react"
import { fetchCategories } from "./Api"

function Form() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        status: "",
    })

    useEffect(() => {
        let isMounted = true

        async function loadCategories() {
            try {
                const data = await fetchCategories()
                if (!isMounted) return

                const normalizedCategories = Array.isArray(data)
                    ? data.map((item) => {
                        if (typeof item === "string") {
                            return { value: item, label: item }
                        }

                        return {
                            value: item?.slug || item?.name || "",
                            label: item?.name || item?.slug || "",
                        }
                    })
                    : []

                setCategories(normalizedCategories)
            } catch (error) {
                console.error("Failed to load categories", error)
                if (isMounted) {
                    setCategories([])
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadCategories()

        return () => {
            isMounted = false
        }
    }, [])

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        const isComplete = Object.values(formData).every((value) => value.trim() !== "")

        if (!isComplete) {
            alert("Please fill in all fields")
            return
        }

        alert("Form submitted successfully!")
        setFormData({
            name: "",
            description: "",
            category: "",
            status: "",
        })
    }

    function handleReset() {
        setFormData({
            name: "",
            description: "",
            category: "",
            status: "",
        })
    }

    return (
        <div className="bg-white border rounded-2xl shadow-sm mt-8">
            <div className="p-8">
                <form onSubmit={handleSubmit}>
                    <div className="mb-8">
                        <label className="block text-lg font-medium mb-3">
                            Name:
                            <textarea
                                name="name"
                                rows="2"
                                cols="35"
                                placeholder="Enter item name"
                                value={formData.name}
                                onChange={handleChange}
                            ></textarea>
                        </label>
                    </div>

                    <div className="mb-8">
                        <label className="block text-lg font-medium mb-3">
                            Description:
                            <textarea
                                name="description"
                                rows="5"
                                cols="35"
                                placeholder="Describe the item"
                                value={formData.description}
                                onChange={handleChange}
                            ></textarea>
                        </label>
                    </div>

                    <div className="mb-8">
                        <label className="block text-lg font-medium mb-3">
                            Category:
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="block w-full mt-1 p-2 rounded border border-gray-300"
                            >
                                <option value="" disabled>
                                    {loading ? "Loading categories..." : "Select a category"}
                                </option>
                                {categories.map((category, index) => (
                                    <option key={category.value || `${index}-${category.label}`} value={category.value}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="mb-8">
                        <label className="block text-lg font-medium mb-4">Status:</label>
                        <div className="flex items-center space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="draft"
                                    className="form-radio"
                                    checked={formData.status === "draft"}
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Draft</span>
                            </label>

                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="active"
                                    className="form-radio"
                                    checked={formData.status === "active"}
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Active</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="status"
                                    value="inactive"
                                    className="form-radio"
                                    checked={formData.status === "inactive"}
                                    onChange={handleChange}
                                />
                                <span className="ml-2">Inactive</span>
                            </label>
                        </div>
                    </div>
                    <div className="p-6 flex justify-end gap-3">
                        <button type="button" onClick={handleReset} className="px-6 py-3 border rounded-xl">
                            Reset
                        </button>
                        <button type="submit" className="px-6 py-3 bg-blue-500 text-white rounded-xl">
                            Create Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form