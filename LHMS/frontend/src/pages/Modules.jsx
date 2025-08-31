import { useState } from 'react';
import Nav from "../components/Nav";
import Footer from "../sections/Footer";
import Input from "../components/Input";
import Button from "../components/Button";
import { initialModules } from "../constants";

const Modules = () => {
  const [modules, setModules] = useState(initialModules);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentModule, setCurrentModule] = useState({ id: null, name: "", code: "" });
  
  // Filter modules based on search query
  const filteredModules = modules.filter(module => 
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    module.code.toLowerCase().includes(searchQuery.toLowerCase())
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
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentModule.name || !currentModule.code) {
      alert("Please fill in both module name and code");
      return;
    }
    
    if (isEditing) {
      // Update existing module
      setModules(modules.map(module => 
        module.id === currentModule.id ? currentModule : module
      ));
    } else {
      // Add new module
      const newModule = {
        ...currentModule,
        id: modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1
      };
      setModules([...modules, newModule]);
    }
    
    // Reset form
    setCurrentModule({ id: null, name: "", code: "" });
    setIsEditing(false);
  };
  
  // Set module for editing
  const handleEdit = (module) => {
    setCurrentModule(module);
    setIsEditing(true);
  };
  
  // Delete a module
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      setModules(modules.filter(module => module.id !== id));
    }
  };
  
  // Cancel editing
  const handleCancel = () => {
    setCurrentModule({ id: null, name: "", code: "" });
    setIsEditing(false);
  };

  return (
    <main className="relative min-h-screen">
      <Nav />
      
      <div className="pt-28 padding-x padding-b">
        <div className="max-container">
          <h1 className="font-palanquin text-4xl font-bold text-center mb-10">Module Management</h1>
          
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
                    id="name"
                    name="name"
                    placeholder="Enter module name"
                    value={currentModule.name}
                    onChange={handleInputChange}
                  />
                  
                  <Input
                    label="Module Code"
                    type="text"
                    id="code"
                    name="code"
                    placeholder="Enter module code"
                    value={currentModule.code}
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
                
                <Input
                  type="text"
                  id="search"
                  placeholder="Q. search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-6"
                />
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-left">
                          Module Name
                        </th>
                        <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-left">
                          Module Code
                        </th>
                        <th className="p-3 border border-neutral font-palanquin font-bold bg-primary text-neutral text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredModules.length > 0 ? (
                        filteredModules.map(module => (
                          <tr key={module.id}>
                            <td className="p-3 border border-neutral font-montserrat">
                              {module.name}
                            </td>
                            <td className="p-3 border border-neutral font-montserrat font-medium">
                              {module.code}
                            </td>
                            <td className="p-3 border border-neutral text-center">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleEdit(module)}
                                  className="text-blue-500 hover:text-blue-700 font-montserrat font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(module.id)}
                                  className="text-coral-red hover:text-red-700 font-montserrat font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="p-4 text-center font-montserrat text-slate-gray">
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