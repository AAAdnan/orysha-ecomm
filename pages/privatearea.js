import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { getRedirectStatus } from 'next/dist/lib/load-custom-routes'

const PrivateArea = () => {

    const router = useRouter()

    if (!Cookies.get('token')) {
        router.push('/')
    }

    return (
        <div>
            Private Area
        </div>
    )
}

export default PrivateArea