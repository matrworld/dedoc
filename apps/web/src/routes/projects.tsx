import { useLocation } from "react-router-dom";

export function Projects()  {
    const location = useLocation();

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold">Projects</h1>
            <div className="grid md:grid-cols-4 gap-10 my-5">
                {Array(10).fill(0).map((_, i) => (<a className="border rounded p-5" href="/#/project/27eQUAHgpjTrRtAyWft7YHnhC7WshMae3ZyD5NBoEnxH">Item {i}</a>))}
            </div>
        </div>
    );
}