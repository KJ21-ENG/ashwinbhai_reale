import propertiesData from '../data/properties.json';

// In-memory store for properties (simulating a database)
let properties = [...propertiesData];
let nextId = Math.max(...properties.map(p => p.id)) + 1;

// Get all properties
export const getAllProperties = () => {
  return [...properties];
};

// Get property by ID
export const getPropertyById = (id) => {
  return properties.find(property => property.id === Number(id));
};

// Add a new property
export const addProperty = (propertyData) => {
  const newProperty = {
    ...propertyData,
    id: nextId++,
    // Ensure default values if not provided
    features: propertyData.features || [],
    images: propertyData.images || []
  };
  
  properties.push(newProperty);
  return newProperty;
};

// Update an existing property
export const updateProperty = (id, propertyData) => {
  const index = properties.findIndex(property => property.id === Number(id));
  if (index === -1) return null;
  
  const updatedProperty = {
    ...properties[index],
    ...propertyData,
    id: Number(id) // Ensure ID doesn't change
  };
  
  properties[index] = updatedProperty;
  return updatedProperty;
};

// Delete a property
export const deleteProperty = (id) => {
  const index = properties.findIndex(property => property.id === Number(id));
  if (index === -1) return false;
  
  properties.splice(index, 1);
  return true;
};

// Filter properties by criteria
export const filterProperties = (filters) => {
  let filteredProperties = [...properties];
  
  if (filters.searchText) {
    const searchLower = filters.searchText.toLowerCase();
    filteredProperties = filteredProperties.filter(property => 
      property.title.toLowerCase().includes(searchLower) || 
      property.description.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.location && filters.location !== 'All Locations') {
    const locationLower = filters.location.toLowerCase();
    filteredProperties = filteredProperties.filter(property => 
      property.location.toLowerCase().includes(locationLower)
    );
  }
  
  if (filters.propertyType && filters.propertyType !== 'All Types') {
    filteredProperties = filteredProperties.filter(property => 
      property.propertyType === filters.propertyType
    );
  }
  
  if (filters.bedrooms && filters.bedrooms !== 'Any') {
    const bedroomsValue = parseInt(filters.bedrooms);
    if (bedroomsValue === 4) {
      // 4+ bedrooms
      filteredProperties = filteredProperties.filter(property => 
        property.bedrooms >= 4
      );
    } else {
      filteredProperties = filteredProperties.filter(property => 
        property.bedrooms === bedroomsValue
      );
    }
  }
  
  if (filters.priceRange && filters.priceRange.length === 2) {
    const [minPrice, maxPrice] = filters.priceRange;
    if (minPrice > 0) {
      filteredProperties = filteredProperties.filter(property => 
        property.price >= minPrice
      );
    }
    if (maxPrice < 10000000) {
      filteredProperties = filteredProperties.filter(property => 
        property.price <= maxPrice
      );
    }
  }
  
  return filteredProperties;
};

// Reset to original data (for testing or demo purposes)
export const resetProperties = () => {
  properties = [...propertiesData];
  nextId = Math.max(...properties.map(p => p.id)) + 1;
  return [...properties];
}; 