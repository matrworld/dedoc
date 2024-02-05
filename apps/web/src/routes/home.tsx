export function Home()  {
    return (
        <div className="mx-auto max-w-3xl grid md:grid-cols-2 min-h-[70vh] items-center">
           <div>
                <h1 className="text-4xl font-bold">DeDoc</h1>
                <p>DeDoc is a decentralized document storage solution that allows you to store your documents on the Solana blockchain. -GPT</p>
           </div>
           <div>
                <img src="https://images.pexels.com/photos/7956727/pexels-photo-7956727.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Documents" />
           </div>
        </div>
    );
}