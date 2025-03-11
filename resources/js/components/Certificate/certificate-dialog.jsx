import { useState } from "react";
import { Button } from "@/components/ui/button";
import CertificateForm from "@/components/Certificate/Form/certificate-form"; // Import the form

const CertificatesModal = ({ patient }) => {
  const [certificates, setCertificates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null); // Stores the certificate to view

  const handleCreate = (newCertificate) => {
    setCertificates([...certificates, { ...newCertificate, id: Date.now() }]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setCertificates(certificates.filter((cert) => cert.id !== id));
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <h2 className="text-green-700 font-bold text-lg">Certificates</h2>

      {/* Create Button */}
      <Button className="bg-blue-600 text-white px-4 py-2 rounded mt-2" onClick={() => setShowForm(true)}>
        Create New Certificate
      </Button>

      {/* Show Form Component When Needed */}
      <CertificateForm open={showForm} setOpen={setShowForm} onSave={handleCreate} />

      {/* List of Certificates */}
      <div className="mt-4">
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <div key={cert.id} className="bg-white p-4 rounded-lg shadow my-2 flex justify-between items-center">
              <div>
                <p className="text-gray-800">
                  <strong>Date:</strong> {cert.date} | <strong>Type:</strong> {cert.type}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Remarks:</strong> {cert.remarks || "None"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-gray-600 text-white px-3 py-1 rounded" onClick={() => setSelectedCertificate(cert)}>
                  View
                </Button>
                <Button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(cert.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No certificates available.</p>
        )}
      </div>

      {/* View Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-green-700 font-bold text-lg mb-4">Certificate Details</h2>
            <p className="text-gray-800">
              <strong>Date:</strong> {selectedCertificate.date}
            </p>
            <p className="text-gray-800">
              <strong>Type:</strong> {selectedCertificate.type}
            </p>
            <p className="text-gray-800">
              <strong>Remarks:</strong> {selectedCertificate.remarks || "None"}
            </p>
            <div className="flex justify-end mt-4">
              <Button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setSelectedCertificate(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatesModal;
