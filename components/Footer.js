const Footer = () => {
    return(
        <footer className="container mx-auto bg-gray-100">
            <div className="container mx-auto px-6 pt-10 pb-6">     
                <div className="flex flex-wrap items-center justify-center">
                    <div className="hidden md:block w-full md:w-1/4 text-center md:text-left">
                    <h5 className="uppercase mb-6 font-bold">Links</h5>
                    <ul className="mb-4">
                        <li className="mt-2">
                        <a href="#" className="hover:underline text-gray-600 hover:text-orange-500">FAQ</a>
                        </li>
                        <li className="mt-2">
                        <a href="#" className="hover:underline text-gray-600 hover:text-orange-500">Help</a>
                        </li>
                        <li className="mt-2">
                        <a href="#" className="hover:underline text-gray-600 hover:text-orange-500">Support</a>
                        </li>
                    </ul>
                    </div>
                    <div className="hidden md:block w-full md:w-1/4 text-center md:text-left">
                    <h5 className="uppercase mb-6 font-bold">Social</h5>
                    <ul className="mb-4">
                        <li className="mt-2">
                            <a href="#" className="hover:underline text-gray-600 hover:text-orange-500"><i className="fab fa-facebook-f"></i></a>
                        </li>
                    </ul>
                    </div>
                    <div className="hidden md:block w-full md:w-1/4 text-center md:text-left">
                        <h5 className="uppercase mb-6 font-bold">Company</h5>
                            <ul className="mb-4">
                                <li className="mt-2">
                                <a href="#" className="hover:underline text-gray-600 hover:text-orange-500">Official Blog</a>
                                </li>
                                <li className="mt-2">
                                <a href="#" className="hover:underline text-gray-600 hover:text-orange-500">About Us</a>
                                </li>
                                <li className="mt-2">
                                <a href="#" className="hover:underline text-gray-600 hover:text-orange-500">Contact</a>
                                </li>
                            </ul>
                        </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
