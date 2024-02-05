export function Project()  {
    return (
        <div className="mx-auto grid grid-cols-12 gap-5">
            <div className="col-span-3">
                <h1 className="text-2xl font-bold mb-3">Pages</h1>
                <div className="flex flex-wrap flex-col gap-3">
                    {Array(10).fill(0).map((_, i) => (<a className="border rounded p-3" href="/#/project/27eQUAHgpjTrRtAyWft7YHnhC7WshMae3ZyD5NBoEnxH">Item {i}</a>))}
                </div>
            </div>
            <div className="col-span-9">
                <div className="aspect-square w-full bg-gray-800 rounded-xl"></div>
            </div>
        </div>
    );
}