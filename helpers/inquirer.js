const inquirer = require('inquirer');
require('colors');

const preguntas = [
  {
      type: 'list',
      name: 'opcion',
      message: '¿Qué desea hacer?',
      choices: [
          {
              value: '1',
              name: `${ '1.'.green } Crear reserva`
          },
          {
              value: '2',
              name: `${ '2.'.green } Ver lista de reservas`
          },
          {
              value: '3',
              name: `${ '3.'.green } Registrar check-in`
          },
          {
              value: '4',
              name: `${ '4.'.green } Registrar check-out`
          },
          {
              value: '5',
              name: `${ '5.'.green } Ver lista de habitaciones disponibles`
          },
          {
              value: '6',
              name: `${ '6.'.green } Gestionar servicios`
          },
          {
              value: '0',
              name: `${ '0.'.green } Salir`
          },
      ]
  }
];
const inquirerMenu = async () => {
  console.clear();
  console.log('=========================='.green);
  console.log('  Gestión de Hotel'.white);
  console.log('==========================\n'.green);

  const { opcion } = await inquirer.prompt(preguntas);
  return opcion;
}
const pausa = async() => {
    
  const question = [
      {
          type: 'input',
          name: 'enter',
          message: `Presione ${ 'enter'.green } para continuar`
      }
  ];

  console.log('\n');
  await inquirer.prompt(question);
}

const leerInput = async( message ) => {

  const question = [
      {
          type: 'input',
          name: 'desc',
          message,
          validate( value ) {
              if( value.length === 0 ) {
                  return 'Por favor ingrese un valor';
              }
              return true;
          }
      }
  ];

  const { desc } = await inquirer.prompt(question);
  return desc;
}
const crearReserva = async (reservas) => {
  console.log('Crear una nueva reserva:\n'.green);

  const nombre = await leerInput('Nombre del huésped:');
  const habitacion = await leerInput('Número de habitación:');
  
  // Verificar si ya existe una reserva activa en la habitación
  const reservaExistente = reservas.find(r => r.habitacion === habitacion && !r.checkOut);

  if (reservaExistente) {
      console.log(`\nYa existe una reserva activa en la habitación ${habitacion}. No se puede crear una nueva reserva.`.red);
  } else {
      const fechaInicio = await leerInput('Fecha de inicio (YYYY-MM-DD):');
      const fechaFin = await leerInput('Fecha de fin (YYYY-MM-DD):');

      const reserva = {
          nombre,
          habitacion,
          fechaInicio,
          fechaFin,
          checkIn: false,
          checkOut: false
      };

      reservas.push(reserva);

      console.log('\nReserva creada exitosamente.'.green);
  }

  await pausa();
}

const verListaReservas = (reservas) => {
console.log('Lista de Reservas:\n'.green);
reservas.forEach((reserva, index) => {
    const estado = reserva.checkOut ? 'Check-Out realizado' : reserva.checkIn ? 'Check-In realizado' : 'Pendiente';
    const servicios = reserva.servicios ? Object.keys(reserva.servicios).filter(servicio => reserva.servicios[servicio]).join(', ') : 'Ninguno';
    console.log(`${(index + 1 + '.').green} Nombre: ${reserva.nombre}, Habitación: ${reserva.habitacion}, Inicio: ${reserva.fechaInicio}, Fin: ${reserva.fechaFin}, Estado: ${estado}, Servicios: ${servicios}`);
});
console.log();
}
const registrarCheckIn = async (reservas) => {
  console.log('Registrar Check-In:\n'.green);
  const habitacion = await leerInput('Número de habitación para el check-in:');
  const reserva = reservas.find(r => r.habitacion === habitacion);

  if (reserva) {
      if (!reserva.checkIn) {
          reserva.checkIn = true;
          console.log('\nCheck-in registrado exitosamente.'.green);
      } else {
          console.log('\nEl check-in ya ha sido registrado anteriormente.'.red);
      }
  } else {
      console.log('\nHabitación no encontrada o ya ha sido registrada.'.red);
  }

  await pausa();
}

const registrarCheckOut = async (reservas) => {
  console.log('Registrar Check-Out:\n'.green);
  const habitacion = await leerInput('Número de habitación para el check-out:');
  const reservaIndex = reservas.findIndex(r => r.habitacion === habitacion);

  if (reservaIndex !== -1) {
    const reserva = reservas[reservaIndex];

    if (reserva.checkIn && !reserva.checkOut) {
      reserva.checkOut = true;
      console.log('\nCheck-out registrado exitosamente.'.green);
      console.log('Registro eliminado después del check-out.'.green);

      // Elimina la reserva del array
      reservas.splice(reservaIndex, 1);
    } else if (!reserva.checkIn) {
      console.log('\nPrimero debe realizar el check-in para esta habitación.'.red);
    } else if (reserva.checkOut) {
      console.log('\nEl check-out ya ha sido registrado anteriormente.'.red);
    }
  } else {
    console.log('\nHabitación no encontrada o no ha sido registrada.'.red);
  }

  await pausa();
}

const verHabitacionesDisponibles = (reservas) => {
  console.log('Habitaciones Disponibles:\n'.green);

  const habitacionesOcupadas = reservas.map(r => r.habitacion);

  // Supongamos que tienes un total de 100 habitaciones
  const totalHabitaciones = 10;

  for (let i = 1; i <= totalHabitaciones; i++) {
      if (!habitacionesOcupadas.includes(i.toString())) {
          console.log(`${i.toString().green} Disponible`);
      }
  }
}

const gestionarServiciosParaHabitacion = async (reservas) => {
console.log('Gestionar Servicios para una Habitación Registrada:\n'.green);
const habitacion = await leerInput('Número de habitación para gestionar servicios:');
const reserva = reservas.find(r => r.habitacion === habitacion);

if (reserva) {
    console.log(`Usted está gestionando servicios para la habitación ${habitacion}:\n`.green);

    const servicios = {
        spa: reserva.servicios && reserva.servicios.spa ? reserva.servicios.spa : false,
        piscina: reserva.servicios && reserva.servicios.piscina ? reserva.servicios.piscina : false,
        limpieza: reserva.servicios && reserva.servicios.limpieza ? reserva.servicios.limpieza : false,
        gimnasio: reserva.servicios && reserva.servicios.gimnasio ? reserva.servicios.gimnasio : false
    };

    const opciones = [
        {
            value: '1',
            name: `${servicios.spa ? '✅' : '❌'} Habilitar/Deshabilitar Spa`
        },
        {
            value: '2',
            name: `${servicios.piscina ? '✅' : '❌'} Habilitar/Deshabilitar Piscina`
        },
        {
            value: '3',
            name: `${servicios.limpieza ? '✅' : '❌'} Habilitar/Deshabilitar Limpieza`
        },
        {
            value: '4',
            name: `${servicios.gimnasio ? '✅' : '❌'} Habilitar/Deshabilitar Gimnasio`
        },
        {
            value: '0',
            name: 'Volver'
        }
    ];

    const pregunta = [
        {
            type: 'list',
            name: 'opcion',
            message: 'Seleccione el servicio que desea habilitar/deshabilitar:',
            choices: opciones
        }
    ];

    const { opcion } = await inquirer.prompt(pregunta);

    switch (opcion) {
        case '1':
            servicios.spa = !servicios.spa;
            break;

        case '2':
            servicios.piscina = !servicios.piscina;
            break;

        case '3':
            servicios.limpieza = !servicios.limpieza;
            break;

        case '4':
            servicios.gimnasio = !servicios.gimnasio;
            break;
    }

    // Actualizar los servicios en la reserva
    reserva.servicios = servicios;

    console.log('\nServicios actualizados exitosamente.'.green);
} else {
    console.log('\nHabitación no encontrada o no ha sido registrada.'.red);
}

await pausa();
}

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  crearReserva,
  verListaReservas,
  registrarCheckIn,
  registrarCheckOut,
  verHabitacionesDisponibles,
  gestionarServiciosParaHabitacion
};