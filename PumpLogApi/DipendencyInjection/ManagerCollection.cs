using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PumpLogApi.Managers;

namespace PumpLogApi.DipendencyInjection
{
    public static class ManagerCollection
    {
        public static IServiceCollection AddManager(this IServiceCollection services)
        {
            services.AddScoped<IPumpLogManager, PumpLogManager>();
            return services;
        }

    }
}