import { Building2Icon, UsersIcon } from "./AppIcons";

const ClientList = ({ clients, selectedClient, onSelectClient }) => {
  return (
    <aside className="w-full lg:w-1/4 bg-white/95 border-r border-gray-200 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
            <UsersIcon size={16} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Clients</h2>
            <p className="text-xs text-gray-500">Select a company</p>
          </div>
        </div>
      </div>

      <ul className="p-4 space-y-2">
        {clients.map((client) => {
          const isSelected = selectedClient?._id === client._id;
          const companyName = client.companyName || client.company_name || "Unnamed Client";

          return (
            <li key={client._id}>
              <button
                type="button"
                onClick={() => onSelectClient(client)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition duration-200 flex items-center gap-3 border ${
                  isSelected
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm ${
                    isSelected ? "bg-white/20" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Building2Icon size={14} />
                </span>
                <span className="font-medium truncate">{companyName}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ClientList;
