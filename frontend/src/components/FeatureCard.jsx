export default function FeatureCard({ icon, title, description }) {
    <div className="flex flex-col items-center text-center p-4">
        <div className="flex-shrink-0">
            {icon}
        </div>
        <div className="mt-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="mt-2 text-base text-text-secondary">{description}</p>
        </div>
    </div>
};
