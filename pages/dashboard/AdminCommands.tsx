export default function AdminCommands() {
  return (
    <div className="card bg-base-100 shadow-xl rounded-none max-w-[600px] min-w-[400px]">
      <div className="card-body">
        <h2 className="card-title">
          Admin Operations
        </h2>
        <div>
          <button
            className="btn btn-primary btn-sm"
            hx-delete="/dashboard/delete-all-customers"
            hx-confirm="Are you sure you want to delete all customers in this tenant?"
            
          >
            Delete all customers
          </button>
        </div>
      </div>
    </div>
  );
}
