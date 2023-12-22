import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        'draftCardWidth': '14rem',
      },
      height: {
        'draftCardHeight': '18rem',
      },
      colors: {
        'regal-blue': '#243c5a',
        'main1':'#9E55BA',
        'main2': "#44498D",
        'Act1' : '#D9D9D9',
        'Act2' : '#D91400',
        'Act3' : '#FF7900',
        'Act4' : '#39D477',
        'Act5' : '#FFC658',
        'Act6' : '#3980F3',
        'Act7' : '#79A0EF',
        'Act8' :'#878CA8',
        'bg':'#F5F6FA',
        '2nd1':'#141933',
        '2nd2':'#505673',
        '2nd3':'#878CA8',
        '2nd4':'#DADEF2',
      },
      backgroundImage: {
        'gradient-24': 'linear-gradient(-45deg, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
    
    patterns: {
      opacities: {
        100: "1",
        80: ".80",
        60: ".60",
        40: ".40",
        20: ".20",
        10: ".10",
        5: ".05",
      },
      sizes: {
        1: "0.25rem",
        2: "0.5rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
        16: "4rem",
        20: "5rem",
        24: "6rem",
        32: "8rem",
      }
    },
  },
  plugins: [
    require('tailwindcss-bg-patterns'),
  ],
}
export default config
