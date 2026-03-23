const ClientList = ({ clients, selectedClient, onSelectClient }) => {
  return (
    <aside className="w-full lg:w-1/4 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Clients</h2>
      </div>

      <ul className="p-3 space-y-2">
        {clients.map((client) => {
          const isSelected = selectedClient?._id === client._id;
          const companyName = client.companyName || client.company_name;

          return (
            <li key={client._id}>
              <button
                type="button"
                onClick={() => onSelectClient(client)}
                className={`w-full text-left px-3 py-2 rounded-md transition shadow-sm hover:bg-gray-50 ${
                  isSelected
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <span className="font-medium">{companyName}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ClientList;
