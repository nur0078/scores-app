import footballLogo from '../assets/logo/footballLogo.svg'

const Nav = () => {
  return (
    <div className='flex text-2xl text-center justify-center'>
      <img 
      src={footballLogo}
      alt="football logo"
      className='h-8 w-8'
      />
    </div>
  )
}

export default Nav