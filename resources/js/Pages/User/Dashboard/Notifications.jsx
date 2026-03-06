import Dashboard from "@/Pages/User/Dashboard/Dashboard";

const Notifications = ({ auth, notifications }) => {
    return (
        <div className="space-y-4">
            <h3 className="font-bold text-lg">Pemberitahuan</h3>
        </div>
    );
};

Notifications.layout = (page) => (
    <Dashboard
        auth={page.props.auth}
        profileIncomplete={page.props.profileIncomplete}
        children={page}
    />
);

export default Notifications;
