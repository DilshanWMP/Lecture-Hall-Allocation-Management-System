import { useState, useEffect } from 'react';
import Nav from "../components/Nav";
import Footer from "../sections/Footer";
import Input from "../components/Input";
import Button from "../components/Button";
import { initialModules } from "../constants";
import axios from 'axios';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentModule, setCurrentModule] = useState({ 
    moduleId: null, 
    moduleName: "", 
    moduleCode: "", 
    description: "" 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch modules from backend
  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8088/api/modules');
      setModules(response.data);
      setError("");
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to load modules. Please try again.');
      // Fallback to initial modules if API fails
      setModules(initialModules);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Filter modules based on search query
  const filteredModules = modules.filter(module => 
    module.moduleName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    module.moduleCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentModule({
      ...currentModule,
      [name]: value
    });
  };

  // Handle form submission (add or update module)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentModule.moduleName || !currentModule.moduleCode) {
      alert("Please fill in both module name and code");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to add/edit modules");
      return;
    }

    try {
      if (isEditing) {
        // Update existing module
        await axios.put(`http://localhost:8088/api/modules/${currentModule.moduleId}`, 
          currentModule,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Add new module
        await axios.post('http://localhost:8088/api/modules', 
          currentModule,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // Refresh modules list
      await fetchModules();
      
      // Reset form
      setCurrentModule({ moduleId: null, moduleName: "", moduleCode: "", description: "" });
      setIsEditing(false);
      setError("");
      
    } catch (error) {
      console.error('Error saving module:', error);
      setError(isEditing ? 'Failed to update module.' : 'Failed to add module.');
    }
  };
  
  // Set module for editing
  const handleEdit = (module) => {
    setCurrentModule({
      moduleId: module.moduleId,
      moduleName: module.moduleName,
      moduleCode: module.moduleCode,
      description: module.description || ""
    });
    setIsEditing(true);
  };
  
  // Delete a module
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to delete modules");
      return;
    }

    try {
      await axios.delete(`http://localhost:8088/api/modules/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh modules list
      await fetchModules();
      setError("");
      
    } catch (error) {
      console.error('Error deleting module:', error);
      setError('Failed to delete module.');
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setCurrentModule({ moduleId: null, moduleName: "", moduleCode: "", description: "" });
    setIsEditing(false);
    setError("");
  };

  // Search modules from backend
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8088/api/modules/search?query=${searchQuery}`);
      setModules(response.data);
      setError("");
    } catch (error) {
      console.error('Error searching modules:', error);
      setError('Search failed. Showing all modules.');
      await fetchModules(); // Fallback to all modules
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <Nav />
      
      <div className="pt-28 padding-x padding-b">
        <div className="max-container">
          <h1 className="font-palanquin text-4xl font-bold text-center mb-10">Module Management</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Add/Edit Module Form */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-3xl p-8">
                <h2 className="font-palanquin text-2xl font-bold text-primary mb-6">
                  {isEditing ? "Edit Module" : "Add Module"}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Module Name"
                    type="text"
                    id="moduleName"
                    name="moduleName"
                    placeholder="Enter module name"
                    value={currentModule.moduleName}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    label="Module Code"
                    type="text"
                    id="moduleCode"
                    name="moduleCode"
                    placeholder="Enter module code"
                    value={currentModule.moduleCode}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    label="Description (Optional)"
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    value={currentModule.description}
                    onChange={handleInputChange}
                  />
                  
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      label={isEditing ? "Update" : "Add"}
                      className="flex-1 rounded-lg py-3 px-4 hover:bg-opacity-90 transition-all duration-300 border-none font-medium"
                    />
                    
                    {isEditing && (
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-gray-500 text-white font-montserrat font-medium py-3 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            {/* Right Column - Module List and Search */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-3xl shadow-3xl p-8">
                <h2 className="font-palanquin text-2xl font-bold text-primary mb-6">Search Modules</h2>
                
                <div className="flex gap-2 mb-6">
                  <Input
                    type="text"
                    id="search"
                    placeholder="Search by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                  <Button
                    label="Search"
                    onClick={handleSearch}
                    className="rounded-lg py-3 px-6 hover:bg-opacity-90 transition-all duration-300 border-none font-medium"
                  />
                  <Button
                    label="Clear"
                    onClick={fetchModules}
                    className="rounded-lg py-3 px-6 bg-gray-500 hover:bg-opacity-90 transition-all duration-300 border-none font-medium"
                  />
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <p className="font-montserrat text-slate-gray">Loading modules...</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-left">
                              Module Code
                            </th>
                            <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-left">
                              Module Name
                            </th>
                            <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-left">
                              Description
                            </th>
                            <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-center">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredModules.length > 0 ? (
                            filteredModules.map(module => (
                              <tr key={module.moduleId}>
                                <td className="p-3 border border-neutral font-montserrat font-medium">
                                  {module.moduleCode}
                                </td>
                                <td className="p-3 border border-neutral font-montserrat">
                                  {module.moduleName}
                                </td>
                                <td className="p-3 border border-neutral font-montserrat text-sm text-slate-gray">
                                  {module.description || 'No description'}
                                </td>
                                <td className="p-3 border border-neutral text-center">
                                  <div className="flex justify-center space-x-2">
                                    <button
                                      onClick={() => handleEdit(module)}
                                      className="text-blue-500 hover:text-blue-700 font-montserrat font-medium px-2 py-1 rounded hover:bg-blue-50"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(module.moduleId)}
                                      className="text-coral-red hover:text-red-700 font-montserrat font-medium px-2 py-1 rounded hover:bg-red-50"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="p-4 text-center font-montserrat text-slate-gray">
                                No modules found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 font-montserrat text-sm text-slate-gray">
                      Showing {filteredModules.length} of {modules.length} modules
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default Modules;