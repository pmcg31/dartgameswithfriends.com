export default function DGWFLogo(props: {
  defaultColor?: string;
  eyeColor?: string;
  smileColor?: string;
  headColor?: string;
  bodyColor?: string;
  flightColor?: string;
}) {
  const compDefColor = props.defaultColor || '#fff';

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlSpace='preserve'
      id='svg5'
      width={61.363}
      height={76.791}
      viewBox='0 0 16.236 20.318'
      {...props}
    >
      <g
        // id='layer1'
        style={{
          display: 'inline'
        }}
        transform='translate(-92.707 -113.433)'
      >
        <path
          //   id='flight'
          //   className='fill_me'
          d='M94.017 125.674a2.41 2.41 0 0 1-.206-.311c-.049-.09-.09-.184-.118-.282a1.092 1.092 0 0 1-.042-.264 1.599 1.599 0 0 1 .02-.293c.013-.266.028-.656.043-1.112.016-.447.032-.953.048-1.46l.045-1.44c.014-.448.026-.81.036-1.062.01-.323.057-.582.12-.79.067-.224.155-.398.245-.537.101-.156.214-.281.321-.383l.03-.028c.115-.106.236-.202.357-.29.402-.235.951-.547 1.482-.846.568-.32 1.21-.68 1.775-.992.598-.332 1.165-.643 1.648-.903a54.23 54.23 0 0 1 1.01-.53 8.99 8.99 0 0 1 .33.153c.187.09.404.198.64.32.496.253 1.066.56 1.662.888.59.326 1.216.68 1.795 1.016.54.313 1.081.634 1.48.885.126.109.246.227.356.357a2.89 2.89 0 0 1 .283.394c.077.132.158.301.22.52.055.197.1.447.109.765l.035 1.063.046 1.44c.017.494.034 1.007.052 1.46.016.442.033.84.049 1.11.018.102.027.193.027.274 0 .083-.008.164-.029.249a1.294 1.294 0 0 1-.104.275c-.051.1-.115.204-.192.315-.034.044-.089.11-.16.192-.072.085-.162.187-.265.305-.212.24-.482.542-.787.88a474.09 474.09 0 0 1-2.184 2.401 886.843 886.843 0 0 1-3.019 3.282 99.981 99.981 0 0 1-.462.494h.222a4.083 4.083 0 0 1-.18-.18 21.214 21.214 0 0 1-.285-.296c-.225-.235-.507-.534-.82-.868a395.345 395.345 0 0 1-4.413-4.794 117.274 117.274 0 0 1-1.057-1.187 16.01 16.01 0 0 1-.163-.19zm-.42.395.179.175c.073.071.166.164.287.285.203.204.473.477.832.844.595.608 1.351 1.389 2.264 2.336.78.809 1.562 1.624 2.26 2.354l.828.863a643.717 643.717 0 0 0 .285.298l.105.109.076.08a.154.161 46.276 0 0 .223 0l.19-.187.294-.296.84-.859c.65-.667 1.384-1.423 2.272-2.34.766-.79 1.605-1.654 2.263-2.327a117.932 117.932 0 0 1 1.117-1.124c.078-.076.14-.135.182-.171.113-.092.227-.187.333-.29.104-.1.204-.21.295-.338.09-.126.167-.266.229-.425.06-.159.103-.33.126-.514.024-.283.046-.679.066-1.127.02-.455.038-.968.054-1.463l.045-1.441c.014-.453.026-.814.037-1.054a4.323 4.323 0 0 0-.121-1.187 3.174 3.174 0 0 0-.417-.965 2.6 2.6 0 0 0-1.402-1.072c-.463-.187-1.037-.41-1.631-.642-.633-.245-1.297-.501-1.93-.749-.638-.249-1.237-.486-1.754-.7a33.767 33.767 0 0 1-.813-.347 7.953 7.953 0 0 1-.285-.134.213.264 51.5 0 0-.2-.001c-.123.05-.285.113-.481.19l-.685.265c-.499.193-1.132.438-1.757.683-.621.243-1.272.5-1.899.755a62.88 62.88 0 0 0-1.598.67 2.639 2.639 0 0 0-.724.424c-.209.171-.424.4-.61.698a3.23 3.23 0 0 0-.39.95c-.084.343-.125.729-.111 1.161.012.243.024.611.038 1.055l.043 1.441c.015.508.032 1.014.05 1.463.019.46.039.85.06 1.126.022.184.063.348.118.495.06.16.136.294.217.41.091.13.191.24.28.33.114.113.245.227.32.294z'
          style={{
            display: 'inline',
            fill: props.flightColor || compDefColor,
            fillOpacity: 1,
            fillRule: 'nonzero',
            stroke: 'none',
            strokeWidth: 0.9,
            strokeLinecap: 'butt',
            strokeLinejoin: 'round',
            strokeDasharray: 'none',
            strokeDashoffset: 0,
            strokeOpacity: 1
          }}
        />
        <circle
          //   id='head'
          //   className='stroke_me'
          cx={100.84}
          cy={-120.647}
          r={3.793}
          style={{
            fill: 'none',
            stroke: props.headColor || compDefColor,
            strokeWidth: 0.9,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 'none',
            strokeDashoffset: 0,
            strokeOpacity: 1
          }}
          transform='scale(1 -1)'
        />
        <path
          //   id='torso'
          //   className='stroke_me'
          d='m100.828 131.394-.022-5.336'
          style={{
            fill: 'none',
            stroke: props.bodyColor || compDefColor,
            strokeWidth: 0.9,
            strokeLinecap: 'round',
            strokeLinejoin: 'miter',
            strokeDasharray: 'none',
            strokeOpacity: 1
          }}
        />
        <path
          //   id='arms'
          //   className='stroke_me'
          d='m105.83 124.897-4.993 3.162-4.992-3.158'
          style={{
            fill: 'none',
            stroke: props.bodyColor || compDefColor,
            strokeWidth: 0.9,
            strokeLinecap: 'round',
            strokeLinejoin: 'miter',
            strokeDasharray: 'none',
            strokeOpacity: 1
          }}
        />
        <path
          //   id='smile'
          //   className='stroke_me'
          d='M102.313 121.913a1.935 1.935 0 0 1-1.444.665 1.935 1.935 0 0 1-1.455-.64'
          style={{
            fill: 'none',
            stroke: props.smileColor || compDefColor,
            strokeWidth: 0.7,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 'none',
            strokeDashoffset: 0,
            strokeOpacity: 1
          }}
        />
        <circle
          //   id='right_eye'
          //   className='fill_me'
          cx={102.141}
          cy={119.679}
          r={0.559}
          style={{
            fill: props.eyeColor || compDefColor,
            fillOpacity: 1,
            stroke: 'none',
            strokeWidth: 0.119832,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 'none',
            strokeDashoffset: 0,
            strokeOpacity: 1
          }}
        />
        <circle
          //   id='left_eye'
          //   className='fill_me'
          cx={99.604}
          cy={119.679}
          r={0.559}
          style={{
            fill: props.eyeColor || compDefColor,
            fillOpacity: 1,
            stroke: 'none',
            strokeWidth: 0.119832,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeDasharray: 'none',
            strokeDashoffset: 0,
            strokeOpacity: 1
          }}
        />
      </g>
    </svg>
  );
}
